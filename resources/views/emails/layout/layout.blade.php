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
    <footer style="margin-top: 1em;">
      <div style="background-color: black; padding: 2rem 1rem;">
        <div>
          <table role="presentation" style="margin: 0 auto;" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding: 0 10px;">
                <a href="https://www.facebook.com/share/15DpQv4ums/?mibextid=wwXIfr">
                  <img src="https://xpactagents.com/images/icons/socials/icon-facebook.png" alt="Facebook" width="20" height="20" style="display: block;">
                </a>
              </td>
              <td style="padding: 0 10px;">
                <a href="https://www.instagram.com/xpactagents.ng?igsh=MTR6ZXluOW12enhtaA==&utm_source=ig_contact_invite">
                  <img src="https://xpactagents.com/images/icons/socials/icon-instagram.png?v1.0" alt="Instagram" width="20" height="20" style="display: block;">
                </a>
              </td>
              <td style="padding: 0 10px;">
                <a href="https://www.tiktok.com/@xpactagents?_t=ZM-8vug6hp38it&_r=1">
                  <img src="https://xpactagents.com/images/icons/socials/icon-tiktok.png" alt="TikTok" width="20" height="20" style="display: block;">
                </a>
              </td>
              <td style="padding: 0 10px;">
                <a href="https://youtube.com/@xpactagents?si=sbu-d4MhWPBMq7Wo">
                  <img src="https://xpactagents.com/images/icons/socials/icon-youtube.png" alt="YouTube" width="20" height="20" style="display: block;">
                </a>
              </td>
              <td style="padding: 0 10px;">
                <a href="https://www.reddit.com/r/Xpactagents/s/jRLoaPCoLW">
                  <img src="https://xpactagents.com/images/icons/socials/icon-reddit.png" alt="Reddit" width="20" height="20" style="display: block;">
                </a>
              </td>
            </tr>
          </table>

        </div>

        <div style="color: white; font-size: 12px;">
          <p><span><b>Kindly note:</b></span> Please be aware of phishing sites and always make sure you are visiting
            the official xpactagents.com website when entering sensitive data.</p>
        </div>

      </div>
    </footer>

  </div>
</body>

</html>