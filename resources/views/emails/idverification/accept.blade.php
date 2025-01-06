@extends('emails.layout.layout')

@section('content')
<div style="margin-top:10px">
  <p>{{$fullname}}, your account has been reviewed and found to comply with our community
    guidelines.Your verification request was approved successfully. A verification badge will now appear next
    to your name as a verified agent.</p>
</div>
@endsection