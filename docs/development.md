[Volver al índice](general.md)

# Instrucciones para el ambiente de desarrollo

*   Clonar el proyecto

```Bash
git clone git@github.com:datachile/datachile.git
```

*   Ingresar al proyecto

```Bash
cd datachile
```

*   Install dependencies

```Bash
npm install
```

*   Copy and configure enviroment file

```Bash
cp .env.js.example .env.js
vi .env.js
```

*   Run development server

```Bash
npm run dev
```

*   Add this line to your /etc/hosts file

```Bash
127.0.0.1       en.datachile.local es.datachile.local
```

*   Open browser

```Bash
http://en.datachile.local:3300/
```

*   Do your job. :D
