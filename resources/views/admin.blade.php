<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin - Risus Media</title>
    <link rel="icon" href="/risuslogo_page-0001-Photoroom.png" type="image/png">
    @vite(['resources/admin/main.ts'])
</head>

<body class="antialiased">
    <div id="app"></div>
</body>

</html>