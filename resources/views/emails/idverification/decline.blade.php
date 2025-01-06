@extends('emails.layout.layout')

@section('content')
<div style="margin-top:10px">
  <p>{{$fullname}}, we are sorry to inform you that your account wasn't verified because
    it doesn't meet the criteria for verification</p>
</div>
@endsection