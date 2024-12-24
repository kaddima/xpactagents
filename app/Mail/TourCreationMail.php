<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TourCreationMail extends Mailable
{
	use Queueable, SerializesModels;
	protected $data;

	/**
	 * Create a new message instance.
	 *
	 * @return void
	 */
	public function __construct($data) {
		$this->data = $data;
	}

	/**
	 * Build the message.
	 *
	 * @return $this
	 */
	public function build()
	{
		return $this->subject("Property Tour Application")
			->view('emails.tour.newTour')
			->with([
				"fullname" => $this->data->first_name." ".$this->data->last_name,
				"tourDate" => Carbon::parse($this->data->date)->format('l, F j, Y \a\t g:i A')
			]);
	}
}
