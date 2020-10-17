<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
  public function index(Request $request) {
    return User::all();
  }


  public function create(Request $request) {
    $name = $request->input("name");
    User::create(["name" => $name]);
    return response()->json(200);
  }
}
