package br.com.temperodaterra;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;

public final class LanchoneteServer {
    private LanchoneteServer() {
    }

    public static void main(String[] args) throws IOException {
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", LanchoneteServer::handleRequest);
        server.setExecutor(Executors.newCachedThreadPool());
        server.start();
        System.out.println("Tempero da Terra disponível em http://localhost:" + port);
    }

    private static void handleRequest(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            send(exchange, 405, "text/plain; charset=utf-8", "Método não permitido".getBytes(StandardCharsets.UTF_8));
            return;
        }

        URI uri = exchange.getRequestURI();
        String path = uri.getPath();
        if ("/api/health".equals(path)) {
            send(exchange, 200, "application/json; charset=utf-8", "{\"status\":\"ok\"}".getBytes(StandardCharsets.UTF_8));
            return;
        }

        if ("/".equals(path)) {
            path = "/index.html";
        }
        if (path == null || path.contains("\\") || path.contains("..")) {
            send(exchange, 400, "text/plain; charset=utf-8", "Caminho inválido".getBytes(StandardCharsets.UTF_8));
            return;
        }

        String resourcePath = path;
        try (InputStream resource = LanchoneteServer.class.getResourceAsStream(resourcePath)) {
            if (resource == null) {
                send(exchange, 404, "text/plain; charset=utf-8", "Página não encontrada".getBytes(StandardCharsets.UTF_8));
                return;
            }
            byte[] content = readAll(resource);
            send(exchange, 200, contentType(path), content);
        }
    }

    private static byte[] readAll(InputStream input) throws IOException {
        byte[] buffer = new byte[4096];
        java.io.ByteArrayOutputStream output = new java.io.ByteArrayOutputStream();
        int length;
        while ((length = input.read(buffer)) != -1) {
            output.write(buffer, 0, length);
        }
        return output.toByteArray();
    }

    private static String contentType(String path) {
        if (path.endsWith(".css")) {
            return "text/css; charset=utf-8";
        }
        if (path.endsWith(".js")) {
            return "application/javascript; charset=utf-8";
        }
        if (path.endsWith(".png")) {
            return "image/png";
        }
        if (path.endsWith(".webmanifest")) {
            return "application/manifest+json; charset=utf-8";
        }
        if (path.endsWith(".svg")) {
            return "image/svg+xml";
        }
        return "text/html; charset=utf-8";
    }

    private static void send(HttpExchange exchange, int status, String contentType, byte[] content) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
        exchange.getResponseHeaders().set("Cache-Control", "no-store");
        exchange.sendResponseHeaders(status, content.length);
        try (OutputStream response = exchange.getResponseBody()) {
            response.write(content);
        }
    }
}
