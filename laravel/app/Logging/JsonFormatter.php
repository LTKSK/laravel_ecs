<?php

namespace App\Logging;
use Monolog\Formatter\LineFormatter;

class JsonFormatter extends LineFormatter {
  public function format(array $record): string
  {
    return json_encode($record);
  }
}
