<?php
/*
 * This file is part of the Microweber framework.
 *
 * (c) Microweber CMS LTD
 *
 * For full license information see
 * https://github.com/microweber/microweber/blob/master/LICENSE
 *
 */

namespace MicroweberPackages\Module;

use Illuminate\Foundation\AliasLoader;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use MicroweberPackages\Admin\Events\ServingAdmin;
use MicroweberPackages\Admin\Facades\AdminManager;
use MicroweberPackages\Admin\MenuBuilder\Link;
use MicroweberPackages\Admin\MenuBuilder\Menu;
use MicroweberPackages\Module\Repositories\ModuleRepository;


class ModuleServiceProvider extends ServiceProvider
{

    public function registerMenu()
    {
        AdminManager::getMenu('left_menu_top')
            ->add(Link::route('admin.module.index', 'Modules')
            ->order(3)
            ->icon('<svg style="margin-right: 20px;" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="m390 976-68-120H190l-90-160 68-120-68-120 90-160h132l68-120h180l68 120h132l90 160-68 120 68 120-90 160H638l-68 120H390Zm248-440h86l44-80-44-80h-86l-45 80 45 80ZM438 656h84l45-80-45-80h-84l-45 80 45 80Zm0-240h84l46-81-45-79h-86l-45 79 46 81ZM237 536h85l45-80-45-80h-85l-45 80 45 80Zm0 240h85l45-80-45-80h-86l-44 80 45 80Zm200 120h86l45-79-46-81h-84l-46 81 45 79Zm201-120h85l45-80-45-80h-85l-45 80 45 80Z"/></svg>'));

    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        Event::listen(ServingAdmin::class, [$this, 'registerMenu']);

        View::addNamespace('module', __DIR__.'/resources/views');

        $this->app->register(\MicroweberPackages\Module\FilamentPluginServiceProvider::class);

        $this->app->singleton('module_manager', function ($app) {
            return new ModuleManager();
        });

        $this->app->resolving(\MicroweberPackages\Repository\RepositoryManager::class, function (\MicroweberPackages\Repository\RepositoryManager $repositoryManager) {
            $repositoryManager->extend(Module::class, function () {
                return new \MicroweberPackages\Module\Repositories\ModuleRepository();
            });
        });


        /**
         * @property ModuleRepository $module_repository
         */
        $this->app->bind('module_repository', function () {
            return $this->app->repository_manager->driver(Module::class);;
        });
    }


    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadMigrationsFrom(__DIR__ . '/migrations/');


        $this->app->bind('module', function () {
            return new Module();
        });

        $aliasLoader = AliasLoader::getInstance();
        $aliasLoader->alias('ModuleManager', \MicroweberPackages\Module\Facades\ModuleManager::class);

        $this->loadRoutesFrom(__DIR__ . '/routes/api.php');
        $this->loadRoutesFrom(__DIR__ . '/routes/admin.php');
        $this->loadRoutesFrom(__DIR__ . '/routes/web.php');
    }
}
