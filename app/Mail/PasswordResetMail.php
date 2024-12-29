<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
	use Queueable, SerializesModels;

	protected $data;
	protected $platform;
	/**
	 * Create a new message instance.
	 *
	 * @return void
	 */
	public function __construct($data, $platform="api")
	{
		$this->data = $data;
		$this->platform = $platform;
	}

	/**
	 * Build the message.
	 *
	 * @return $this
	 */
	public function build()
	{
		return $this->subject("Password Reset")
			->view('emails.auth.passwordResetMail')
			->with(["token" => $this->data->token, "platform"=>$this->platform]);
	}
}
