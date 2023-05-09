<div class="card col-xxl-11 mx-auto" x-data="{ showFilters: false }">

   <div class="card-body">
       <div class="row">
           <div class="d-flex align-items-center justify-content-between mb-4">
               <h1 class="mb-0">
                   <svg fill="currentColor" style="margin-right: 20px;" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="m390 976-68-120H190l-90-160 68-120-68-120 90-160h132l68-120h180l68 120h132l90 160-68 120 68 120-90 160H638l-68 120H390Zm248-440h86l44-80-44-80h-86l-45 80 45 80ZM438 656h84l45-80-45-80h-84l-45 80 45 80Zm0-240h84l46-81-45-79h-86l-45 79 46 81ZM237 536h85l45-80-45-80h-85l-45 80 45 80Zm0 240h85l45-80-45-80h-86l-44 80 45 80Zm200 120h86l45-79-46-81h-84l-46 81 45 79Zm201-120h85l45-80-45-80h-85l-45 80 45 80Z"></path></svg>
                   <strong>{{  _e("Modules")}}</strong>
               </h1>
               <div class="col-xl-4 my-2 my-md-0 flex-grow-1 flex-md-grow-0">
                   <div class="input-icon">
                      <span class="input-icon-addon">
                          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M796 935 533 672q-30 26-69.959 40.5T378 727q-108.162 0-183.081-75Q120 577 120 471t75-181q75-75 181.5-75t181 75Q632 365 632 471.15 632 514 618 554q-14 40-42 75l264 262-44 44ZM377 667q81.25 0 138.125-57.5T572 471q0-81-56.875-138.5T377 275q-82.083 0-139.542 57.5Q180 390 180 471t57.458 138.5Q294.917 667 377 667Z"/></svg>
                      </span>
                       <input type="text" class="form-control" placeholder="Search..." wire:keydown.enter="filter" wire:model.lazy="keyword" />
                       <div wire:loading wire:target="keyword" class="spinner-border spinner-border-sm" role="status">
                           <span class="visually-hidden">{{  _e("Searching")}}...</span>
                       </div>
                   </div>
               </div>
               <div>

                   <button x-on:click="showFilters = ! showFilters" type="button" class="btn btn-outline-default">
                       <span x-show="!showFilters">Show filters</span>
                       <span x-show="showFilters">Hide filters</span>
                   </button>

                   <button type="button" class="btn btn-outline-primary" wire:click="reloadModules">
                       <div wire:loading wire:target="reloadModules" class="spinner-border spinner-border-sm" role="status">
                           <span class="visually-hidden">{{  _e("Loading")}}...</span>
                       </div>
                       {{ _e("Reload modules") }}
                   </button>

               </div>
           </div>

           <div class="card shadow-sm rounded p-4 mb-4" x-show="showFilters">
               <div class="row d-flex justify-content-between">
                   <div class="col-md-6">
                       <div>
                           <label class="d-block mb-2">{{  _e("Type")}}</label>
                           <select class="form-select" wire:model="type" data-width="100%">
                               <option value="live_edit">{{  _e("Live edit modules")}}</option>
                               <option value="admin" selected>{{  _e("Admin modules")}}</option>
                               <option value="advanced">{{  _e("All modules")}}</option>
                               <option value="elements">{{  _e("Elements")}}</option>
                           </select>
                       </div>
                   </div>
                   <div class="col-md-6">
                       <div>
                           <label class="d-block mb-2">{{  _e("Status")}}</label>
                           <select class="form-select" wire:model="installed" data-width="100%">
                               <option value="1">{{  _e("Installed")}}</option>
                               <option value="0">{{  _e("Uninstalled")}}</option>
                           </select>
                       </div>
                   </div>
               </div>
           </div>

           <div class="row row-cards bg-azure-lt">

               @foreach($modules as $module)
                   <div class="col-md-3 p-3" wire:key="{{$module->id}}-{{md5($module->module)}}">
                       <div class="card" style="min-height:170px">
                           <div class="card-body text-center d-flex align-items-center justify-content-center flex-column">
                               <a href="{{module_admin_url($module->module)}}">
                                   <div class="mx-auto mb-2" style="width: 40px;height: 40px">
                                       {!! $module->getIconInline() !!}
                                   </div>
                                   <h3 class="card-title pt-2 mb-0 text-muted">
                                       {{str_limit(_e($module->name, true), 30)}}
                                   </h3>
                               </a>

                               @if($module->installed == 1)
                                   @if($confirmUnistallId == $module->id)
                                   <button wire:click="uninstall('{{$module->id}}')" wire:target="uninstall('{{$module->id}}')" wire:loading.attr="disabled" type="button" class="btn btn-sm btn-outline-danger">
                                       <div wire:loading wire:target="uninstall('{{$module->id}}')" class="spinner-border spinner-border-sm" role="status">
                                           <span class="visually-hidden">Uninstalling...</span>
                                       </div>
                                       Confirm Uninstall
                                   </button>
                                   @else
                                   <button wire:click="confirmUninstall('{{$module->id}}')" wire:target="confirmUninstall('{{$module->id}}')" wire:loading.attr="disabled" type="button" class="btn btn-sm btn-outline-danger">
                                       Uninstall
                                   </button>
                                   @endif
                                @endif

                               @if($module->installed == 0)
                               <button wire:click="install('{{$module->id}}')" wire:target="install('{{$module->id}}')" wire:loading.attr="disabled" type="button" class="btn btn-sm btn-outline-success">
                                   <div wire:loading wire:target="install('{{$module->id}}')" class="spinner-border spinner-border-sm" role="status">
                                       <span class="visually-hidden">Installing...</span>
                                   </div>
                                   Install
                               </button>
                               @endif

                           </div>
                       </div>
                   </div>
               @endforeach

           </div>

           <div class="d-flex justify-content-center mt-4">
               {!! $modules->links('livewire-tables::specific.bootstrap-4.pagination') !!}
           </div>
       </div>
   </div>

</div>
