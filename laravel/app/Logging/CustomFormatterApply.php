<?php

namespace App\Logging;

use App\Logging\JsonFormatter;

class CustomFormatterApply {
  public function __invoke($logging) {
    foreach ($logging->getHandlers() as $handler) {
      $handler->setFormatter(new JsonFormatter());
    }
  }
}
