# GORDON 74 STORE — Site completo (UM projeto)

Este é o projeto **unificado** das duas landing pages. O arquivo principal é `index.html`.
A ordem de exibição em **uma única página** é:

1. **Camisas de futebol:** banner principal, bolinhas, ligas/campeonatos, NBA e demais coleções.
2. **Tênis:** banner principal quadrado (1:1), banner horizontal de tênis, carrossel automático com 11 imagens.
3. **Chuteiras:** banners e bolinhas de Nike, Adidas, Puma e Outras Marcas (Joma/New Balance).

Há somente **um cabeçalho branco**, **um menu com as categorias nessa ordem**, **uma pesquisa unificada**, **um rodapé** e **um botão flutuante de WhatsApp**.

## Loja

- Nome: GORDON 74 STORE
- Logo: https://ik.imagekit.io/verlcwgen/Emblema%20Esportivo%20Godon%2074%20Store.png
- WhatsApp: https://wa.me/5591989504731
- Instagram: não incluído
- Fórmula 1: removida
- Mizuno: removida
- Estilo: branco, cinza e preto

## Preservado

Os links dos catálogos e todas as imagens de escudos e bolinhas foram preservados dos ZIPs enviados. A seção de tênis continua com 11 banners; não foi inventado o 12º link. Nas chuteiras, Adidas Futsal, Puma Futsal e New Balance continuam sem catálogo porque esses links já estavam vazios no projeto recebido.

## Arquivos

- `index.html`: página inicial, que reúne tudo.
- `configuracao.js`, `script.js`, `style.css`: dados e interface das **camisas**; o menu e a pesquisa também incluem as seções de calçados.
- `tenis/config.js`, `tenis/boot.js`, `tenis/app.js`, `tenis/style.css`: dados e seções de **tênis e chuteiras**. O estilo dos calçados foi isolado para evitar conflitos entre as duas landing pages.
- `assets/`: recursos da página de camisas.

## Publicação no GitHub Pages ou Vercel

Descompacte o ZIP e envie **todo o conteúdo da pasta do projeto**, inclusive a pasta `tenis/`, para a raiz do seu repositório. Defina a raiz como diretório publicado. Não precisa de instalação, build, servidor Node nem banco de dados.

Os banners e as imagens permanecem hospedados em seus URLs externos originais; dependem da disponibilidade desses endereços. Não altere `id`s do HTML sem atualizar os arquivos JS correspondentes.

## Correção do banner principal de camisas

A imagem principal das camisas, colocada antes das coleções, usa exatamente a URL pública confirmada em 10/11/2026:

https://ik.imagekit.io/verlcwgen/Camisas%20de%20Futebol%20em%20Est%C3%BAdio%20Geom%C3%A9trico%20Monocrom%C3%A1tico.png



## Atualização: PRONTA ENTREGA e OUTRAS COLEÇÕES

- Banner de PRONTA ENTREGA: inserido imediatamente depois do banner principal das camisas e antes das demais seções.
- Imagem do banner: https://ik.imagekit.io/verlcwgen/Camisas%20e%20T%C3%AAnis%20em%20Pronta%20Entrega.png
- Clique no banner abre o catálogo: https://photos.app.goo.gl/anEaHQTuLoNj9aMY6
- As oito imagens circulares de OUTRAS COLEÇÕES foram alteradas conforme os novos links ImageKit enviados.
- Os oito links dos catálogos foram **mantidos**, assim como os demais catálogos, escudos, ligas, carrosséis e conteúdos de tênis/chuteiras.
- Formato responsivo do banner horizontal; imagens de coleções continuam em cards circulares.
