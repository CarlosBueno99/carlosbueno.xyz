<script lang='ts'>
    export let bots: any = [];
    
</script>

<div class="overflow-x-auto w-4/5 rounded-lg border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
      <!-- head -->
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <label>
              <input type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            </label>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each bots as bot}
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <label>
                <input type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </label>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <div class="h-12 w-12 rounded-lg overflow-hidden">
                  <img src="{bot.imageUrl}" alt="Bot's face" class="h-full w-full object-cover" />
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {bot.name}
              <br/>
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {bot.type}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{bot.channel}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <form method="POST" action="?/deleteBot">
                <input type="hidden" name="id" hidden value={bot.id} />
                <button class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  delete
                </button>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>