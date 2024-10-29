<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MakeService extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'make:service {name}';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Create a new service class';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return int
	 */

	public function handle()
	{
		$name = $this->argument('name');
		$path = app_path("Services/{$name}.php");

		// Check if the Services directory exists; if not, create it
		if (!file_exists(app_path('Services'))) {
			mkdir(app_path('Services'), 0755, true);
		}


		if (file_exists($path)) {
			$this->error("Service {$name} already exists!");
			return;
		}

		$stub = "<?php\n\nnamespace App\Services;\n\nclass {$name}\n{\n  // Define your methods here\n}\n";

		file_put_contents($path, $stub);
		$this->info("Service {$name} created successfully.");
	}
}
