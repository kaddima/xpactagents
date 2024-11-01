<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MakeRepository extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:repository {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates repository';

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
		$path = app_path("Repository/{$name}.php");

		// Check if the Services directory exists; if not, create it
		if (!file_exists(app_path('Repository'))) {
			mkdir(app_path('Repository'), 0755, true);
		}


		if (file_exists($path)) {
			$this->error("Repository {$name} already exists!");
			return;
		}

		$stub = "<?php\n\nnamespace App\Repository;\n\nuse App\Repository\BaseRepository;\n\nclass {$name} extends BaseRepository\n{\n  // Define your methods here\n}\n";

		file_put_contents($path, $stub);
		$this->info("Service {$name} created successfully.");
	}
}