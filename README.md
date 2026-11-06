# Tempero da Terra

Site de pedidos com cardápio, sacola e envio do pedido pelo WhatsApp. O servidor Java serve os arquivos do site; o pagamento e a confirmação do pedido são combinados diretamente com a lanchonete no WhatsApp.

## Publicar no Render

O arquivo `render.yaml` configura a publicação do site como um serviço estático. No Render, crie um Blueprint apontando para este repositório e selecione o serviço `tempero-da-terra`. O Render gera um endereço público `onrender.com` e publica automaticamente os próximos commits da branch principal.

## Instalar no celular

O site pode ser instalado como PWA pelo navegador, sem precisar de uma loja de aplicativos. No Android, abra o endereço HTTPS do site no Chrome e escolha **Instalar app** ou **Adicionar à tela inicial** no menu. No iPhone, abra no Safari, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**. Depois da primeira visita, o cardápio também abre offline; enviar pedidos pelo WhatsApp ainda precisa de conexão.

## Executar localmente

Para executar o servidor Java localmente:

- JDK 8 ou superior instalado (inclui `javac` e `java`).
- Windows para usar o arquivo `run.bat`.

Na pasta do projeto, execute:

```bat
run.bat
```

Depois, abra [http://localhost:8080](http://localhost:8080). Para escolher outra porta, execute a classe Java com o número da porta como argumento.

O telefone de atendimento está configurado em `app.js`, na constante `WHATSAPP_NUMBER`.
