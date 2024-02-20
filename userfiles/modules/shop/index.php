<?php
//$controller = \Illuminate\Support\Facades\App::make(\MicroweberPackages\Shop\Http\Controllers\ShopController::class);
//
//$request = new \Illuminate\Http\Request();
//$request->merge($params);
//$request->merge($_REQUEST);
//
//$controller->setModuleParams($params);
//$controller->setModuleConfig($config);
//$controller->registerModule();
//
//echo $controller->index($request);

use MicroweberPackages\Page\Models\Page;

$contentFromId = get_option('content_from_id', $params['id']);

$appliedDefaultSettings = get_option('applied_default_shop_settings', $params['id']);
if (!$appliedDefaultSettings) {
    save_option('filtering_by_tags', 1, $params['id']);
    save_option('filtering_by_categories', 1, $params['id']);
    save_option('filtering_by_custom_fields', 1, $params['id']);
}

if (!isset($params['template'])) {
    $params['template'] = 'default';
}

$moduleTemplateNamespace = false;
if (isset($params['template'])) {
    $livewireModuleBladeView = 'microweber-module-shop::livewire.shop.' . $params['template'];
    if (view()->exists($livewireModuleBladeView)) {
        $moduleTemplateNamespace = $livewireModuleBladeView;
    }
}

// THE NEW SHOP
echo view('microweber-module-shop::render-livewire-shop', [
    'moduleId' => $params['id'],
    'moduleType' => 'shop',
    'moduleTemplateNamespace' => $moduleTemplateNamespace
]);


?>
