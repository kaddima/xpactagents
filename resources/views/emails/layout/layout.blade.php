<!-- resources/views/layouts/app.blade.php -->
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>

<body>
  <div style="max-width:450px; margin:0 auto;">
    <div style="margin-bottom: 20px">
      <img src="https://xpactagents.com/images/logo/logo.png" alt="" style="width:150px; margin:0 auto; display:block;" />
    </div>
    <div class="container">
      @yield('content')
    </div>

  </div>
</body>

</html>