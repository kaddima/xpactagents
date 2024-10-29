@extends('layout')

@section('title', 'heyyy')

@section('app-style')
<link rel="stylesheet" href="{{asset("css/app.css")}}">

@endsection

@section('content')
  <div id="root"></div>
  
@endsection

@section('app-code')
  <script src="{{ asset('js/manifest.js') }}"></script>
  <script src="{{ asset('js/vendor.js') }}"></script>
  <script src="{{ asset('js/main_bundle.js') }}"></script>
@endsection