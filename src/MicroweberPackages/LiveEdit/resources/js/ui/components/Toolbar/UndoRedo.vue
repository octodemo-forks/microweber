<template>
    <button v-on:click="undo()" class=" btn btn-icon me-2 live-edit-toolbar-buttons live-edit-toolbar-buttons-undo-redo" id="vue-toolbar-undo" :disabled='undoIsDisabled'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px">
            <path
                d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"/>
        </svg>
    </button>
    <button v-on:click="redo()" class="btn btn-icon live-edit-toolbar-buttons live-edit-toolbar-buttons-undo-redo" id="vue-toolbar-redo" :disabled='redoIsDisabled'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px">
            <path
                d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"/>
        </svg>
    </button>
</template>

<script>
export default {
    methods: {
        undo() {
            mw.app.state.undo()
            this.setButtons();
        },
        redo() {
            mw.app.state.redo()
            this.setButtons();
        },
        setButtons() {
            this.undoIsDisabled = !mw.app.state.hasNext;
            this.redoIsDisabled = !mw.app.state.hasPrev;
        }
    },
    data() {
        return {
            undoIsDisabled: true,
            redoIsDisabled: true,
        };
    },
    mounted() {
        mw.app.canvas.on('liveEditCanvasLoaded', () => {
            mw.app.state.on('record', () => this.setButtons())
            mw.app.state.on('undo', () => function () {
                var undoStateTarget = null;
                var state = mw.app.state.state();
                if (state && state[0] && state[0].target) {
                    undoStateTarget = state[0].target;
                }
                if (undoStateTarget) {
                    mw.app.registerChange(undoStateTarget);
                }
                this.setButtons()
            })
            mw.app.state.on('redo', () => function () {
                var redoStateTarget = null;
                var state = mw.app.state.state();
                if (state && state[0] && state[0].target) {
                    redoStateTarget = state[0].target;
                }
                if (redoStateTarget) {
                    mw.app.registerChange(redoStateTarget);
                }
                this.setButtons()
            })
        })


    },

}
</script>
