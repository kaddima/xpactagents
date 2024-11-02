@extends('emails.layout.layout')

@section("content")
<div style="width:80%;padding: 20px 10px;margin: auto;" class="border">
  <div style="text-align: center">
    <h2 style="font-size: 2rem;font-weight: bold; margin-bottom: 12px;opacity: .8">Password Reset</h2>
    <p>You have requested to reset your password on xpactagent.com.
      Please use the 6 (six) digit token below to reset your password.</p>

    <h1>{{$token}}</h1>

    <div style="margin-top: 3rem;font-size: 13px; opacity: .85">
      <p>If you did not request a password reset, you can safely ignore
        this email. Only a person with access to your email can reset your account password</p>
    </div>
  </div>
</div>
@endsection