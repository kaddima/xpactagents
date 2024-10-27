<?php
namespace Business;

require __DIR__.'/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//CONSTANT
define('SITE_LOGO_PATH', __DIR__.'/../public/images/logo-blue.png');
define('EMAIL_USERNAME','');
define('EMAIL_PASSWORD','Hlyt@p123');
define('MAIL_HOST','smtp.hostinger.com');


class Mailer{

    public static function sendMail($toEmail, $message, $subject='', $image=true)
    {
        $mail = new PHPMailer(true);
        try {

            //Tell PHPMailer to use SMTP
            $mail->isSMTP();
            //Enable SMTP debugging
            // SMTP::DEBUG_OFF = off (for production use)
            // SMTP::DEBUG_CLIENT = client messages
            // SMTP::DEBUG_SERVER = client and server messages
            $mail->SMTPDebug = SMTP::DEBUG_OFF;
            //Set the hostname of the mail server
            $mail->Host = 'smtp.hostinger.com' ;
            // use
            // $mail->Host = gethostbyname('smtp.gmail.com');
            // if your network does not support SMTP over IPv6
            //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
            $mail->Port = 587;
            //Set the encryption mechanism to use - STARTTLS or SMTPS
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            //Whether to use SMTP authentication
            $mail->SMTPAuth = true;

            //Username to use for SMTP authentication - use full email address for gmail
            $mail->Username = EMAIL_USERNAME;

            //Password to use for SMTP authentication
            $mail->Password = EMAIL_PASSWORD;

            //Set who the message is to be sent from
            $mail->setFrom(EMAIL_USERNAME, 'FAB Bank');

            //set reply to
            $mail->addReplyTo(EMAIL_USERNAME);

            //Set who the message is to be sent to
            $mail->addAddress($toEmail);
            //Set the subject line
            $mail->Subject = $subject;

            $mail->isHTML(true);

            $layout = '<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
            </head>
            <body >
                <div style="max-width:450px; margin:0 auto;">
                    <div style="margin-bottom: 20px">
                        <img src="https://xpactagent/images/logo/logo.png" alt="" style="width:150px; margin:0 auto; display:block;"/>
                    </div>'.
                    $message
                .'</div>
            </body>
            </html>';
            
            $mail->Body = $layout;

            $mail->send();

            return true;
        }
        catch (\Exception $e){
            $error = 'Message could not be sent. Mailer Error: '.$e->getMessage() .
                'FILE: '.$e->getFile(). ' LINE :'.$e->getLine();

            //trigger_error($error, E_USER_NOTICE);

            return false;
        }
    }

}

