<!-- resources/views/child.blade.php -->

@extends('emails.layout.layout')

@section('content')
<div style="margin-top:10px">
  <p>Dear {{ $fullname }},</p>

  <p>Thank you for scheduling your property tour! We're thrilled to help you explore your potential new home. Our team is preparing for your visit, and we're confident you'll enjoy the experience.</p>

  <p>Your tour is confirmed for <strong>{{ $tourDate }}</strong>. You will be notified as soon as our agents are available to guide you through the property. If any issues arise or if there are any changes to the schedule, we'll be sure to send you an update right away.</p>

  <p>If you need to reschedule or have any questions at all, please don't hesitate to reach out. We're here to help every step of the way!</p>

  <p>We look forward to seeing you soon!</p>

  <p>Best regards,</p>
  <p><strong>Xpactagents Property Tour Team</strong></p>

  <p><em>Contact us anytime at <a href="mailto:support@xpactagents.com">support@xpactagents.com</a> for assistance.</em></p>

</div>
@endsection