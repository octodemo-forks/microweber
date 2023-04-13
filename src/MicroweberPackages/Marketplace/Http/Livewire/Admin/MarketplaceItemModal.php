<?php

namespace MicroweberPackages\Marketplace\Http\Livewire\Admin;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use LivewireUI\Modal\ModalComponent;
use MicroweberPackages\ComposerClient\Client;
use MicroweberPackages\Package\MicroweberComposerClient;

class MarketplaceItemModal extends ModalComponent
{
    public $name;
    public $package = [];

    public function mount()
    {
        $foundedPackage = [];
        $foundedPackageVersions = [];
        $packageName = $this->name;
        $packages = Cache::remember('livewire-marketplace', Carbon::now()->addHours(12), function () {
            $marketplace = new MicroweberComposerClient();
            return $marketplace->search();
        });
        if (!empty($packages)) {
            foreach ($packages as $packageVersions) {
                foreach ($packageVersions as $packageVersion=>$packageVersionData) {
                    if ($packageVersionData['name'] == $packageName) {
                        $foundedPackage = $packageVersionData;
                        $foundedPackageVersions[] = $packageVersion;
                    }
                }
            }
        }
        $foundedPackage['versions'] = $foundedPackageVersions;

        $this->package = $foundedPackage;
    }

    public function render()
    {
        return view('marketplace::admin.marketplace.livewire.modals.marketplace-item-modal');
    }
}
