<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class IdVerifcationDeclineMail extends Mailable
{
    use Queueable, SerializesModels;
		protected $data;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
      $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Verification Request Declined")
			->view('emails.idverification.decline')
			->with("fullname",$this->data->fullname);
    }
}
