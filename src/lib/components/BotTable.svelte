<script lang='ts'>
    export let bots: any = [];
    
</script>

<div class="overflow-x-auto w-4/5">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" class="checkbox"/>
            </label>
          </th>
          <th>Imagem</th>
          <th>Name</th>
          <th>Channel</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each bots as bot}
        <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <td>
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img src="{bot.imageUrl}" alt="Bot's face" />
                  </div>
                </div>
              </div>
            </td>
            <td>
              {bot.name}
              <br/>
              <span class="badge badge-ghost badge-sm">{bot.type}</span>
            </td>
            <td>{bot.channel}</td>
            <th>
              <form method="POST" action="?/deleteBot">
                <input type="hidden" name="id" hidden value={bot.id} />
                <button class="btn btn-error btn-xs">delete</button>
              </form>
            </th>
          </tr>
        {/each}
      <!-- foot -->
      <tfoot>
        <tr>
            <th></th>
            <th>Image</th>
            <th>Name</th>
            <th>Channel</th>
            <th></th>
          </tr>
      </tfoot>
      
    </table>
  </div>