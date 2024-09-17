<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>

        @viteReactRefresh
        @vite('resources/js/main.tsx')
        @vite('resources/css/app.css')
    </head>
    <body class="mx-8 md:mx-12 bg-background text-foreground">
        <div id="root"></div>
    </body>
</html>
