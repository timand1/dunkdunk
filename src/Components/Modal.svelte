<script>
    export let open = false
    export let listItems;
    export let active
    export let parentFunction;
    export let right
    export let width
    


</script>

{#if open}
    <div class="modal" class:left={right === false} style="width:{width}px" class:right={right}>
        <div class="modal-container">
            {#each Object.keys(listItems) as key}
            <button class:active={key === active} on:click={parentFunction(key)}>
                {#if key === active}
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><path fill="#1daa4e" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8s8-3.59 8-8s-3.59-8-8-8zm-2 13l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" opacity=".3"/><path fill="#1daa4e" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"/></svg>            {/if}
                {key}
            </button>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss" scoped>
    .modal {
        position: absolute;
        border-radius: 8px;
        bottom: 2.2rem;
        right: 3.3rem;
        max-height: 400px;
        // width: 400px;
        overflow-y: auto;
        box-shadow:
            1.6px 1.2px 33.1px rgba(0, 0, 0, 0.062),
            4.1px 3.1px 40.1px rgba(0, 0, 0, 0.089),
            8.3px 6.4px 42.5px rgba(0, 0, 0, 0.111),
            17.2px 13.1px 45.8px rgba(0, 0, 0, 0.138),
            47px 36px 67px rgba(0, 0, 0, 0.2)
        ;
        &.left {
            left: 3.3rem;
        }
        &.right {
            right: 3.3rem; 
        }
        .modal-container {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            button {
                border: none;
                cursor: pointer;
                border-bottom: 1px solid gray;
                padding: 8px 30px;
                overflow-x: hidden;
                background-color: #202020;
                color: #d3d0d0;
                &:hover {
                    background-color: #404040;
                    transition: 300ms;
                }
            }
            .active {
                background-color: #181818;
                position: relative;
                svg {
                position: absolute;
                // left : 0.5rem;
                left:calc(-50% + 1rem);
                top: calc(50% - 0.5rem);
                }
            }
        }
    }
</style>