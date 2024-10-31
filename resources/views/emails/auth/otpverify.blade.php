<!-- resources/views/child.blade.php -->
 
@extends('emails.layout.layout')
 
@section('content')
<div style="margin-top:10px">
  <h1 style="font-size:18px; font-weight:bold;">Confirm your registration</h1>
  <div style="margin-top:10px;">
    <p style="margin: 0;padding:0;">Welcome to Xpact Agent</p>
    <p style="margin: 0;padding:0;">Here is your account activation code</p>
  </div>
  <h1>{{$token}}</h1>
  <div>
    <h4>Security tips</h4>
    <ul style="padding-left: 20px;">
      <li>Never give your password to anyone</li>
      <li>Never call any phone number or personal details for anyone claiming to be XpactAgent support.</li>
    </ul>
  </div>
  <p style="font-size:13px;">This step is to ensure that your email address is not used without your consent. You can ignore this email if this was not triggered by you</p>
  <div style="color: rgb(129, 122, 122);">
    <p style="margin: 0;padding:0;">XpactAgent Team</p>
    <span>This is an automated message please do not reply</span>
  </div>
</div>
@endsection
