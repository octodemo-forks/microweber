<?php

namespace MicroweberPackages\User\Http\Livewire\Admin;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;
use Livewire\Component;
use Livewire\WithFileUploads;
use MicroweberPackages\User\Models\User;

class UpdateStatusAndRoleForm extends Component
{

    /**
     * The component's state.
     *
     * @var array
     */
    public $state = [];

    /**
     * The new avatar for the user.
     *
     * @var mixed
     */
    public $photo;


    public $userId = false;

    /**
     * Prepare the component.
     *
     * @return void
     */
    public function mount($userId = false)
    {
        if ($userId) {
            $this->userId = $userId;
            $this->state = User::where('id', $userId)->first()->withoutRelations()->toArray();
        } else {
            $this->state = Auth::user()->withoutRelations()->toArray();
        }
    }




    /**
     * Update the user's profile information.
     * @return void
     */
    public function updateProfileInformation()
    {
        $this->resetErrorBag();

        if ($this->userId) {
            $user = User::where('id', $this->userId)->first();
        } else {
            $user = Auth::user();
        }

        $input = $this->state;

        $user->forceFill([
            'is_admin' => $input['is_admin'],
            'is_active' => $input['is_active'],
        ])->save();

        $this->emit('saved');
    }

    /**
     * Get the current user of the application.
     *
     * @return mixed
     */
    public function getUserProperty()
    {
        return Auth::user();
    }

    /**
     * Render the component.
     *
     * @return \Illuminate\View\View
     */
    public function render()
    {
        return view('admin::livewire.edit-user.update-status-and-role-form');
    }
}
