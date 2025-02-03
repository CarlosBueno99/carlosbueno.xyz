import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { tursoClient } from '$lib/server/client';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        // Log the start of the request
        const requestId = Math.random().toString(36).substring(7);
        console.log(`[${requestId}] Starting exercise load request`);
        
        // Check table
        console.log(`[${requestId}] Checking table existence...`);
        const tableCheck = await tursoClient.execute({
            sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='exercises'",
            args: []
        });
        console.log(`[${requestId}] Table check result:`, tableCheck.rows);
        
        if (tableCheck.rows.length === 0) {
            console.log(`[${requestId}] Table does not exist, creating it...`);
            await tursoClient.execute({
                sql: `CREATE TABLE IF NOT EXISTS exercises (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    check_in TEXT NOT NULL,
                    check_out TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,
                args: []
            });
            console.log(`[${requestId}] Table created successfully`);
        }
        
        // Get exercises - let's check what's in the table
        console.log(`[${requestId}] Querying exercises table...`);
        const result = await tursoClient.execute({
            sql: 'SELECT * FROM exercises ORDER BY check_in DESC',
            args: []
        });
        console.log(`[${requestId}] Raw query result:`, {
            rows: result.rows,
            rowsLength: result.rows.length,
            columns: result.columns,
            lastRowId: result.lastRowId,
            rowsAffected: result.rowsAffected
        });
        console.log(`[${requestId}] Number of exercises found:`, result.rows.length);
        if (result.rows.length > 0) {
            console.log(`[${requestId}] Sample exercise:`, result.rows[0]);
        }
        
        // Return data
        const response = { exercises: result.rows };
        console.log(`[${requestId}] Returning data:`, response);
        return response;
        
    } catch (err: any) {
        console.error('Load error details:', {
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
            type: err.constructor.name
        });
        throw error(500, 'Failed to load exercise data: ' + (err instanceof Error ? err.message : String(err)));
    }
};

export const actions: Actions = {
    addExercise: async ({ request }) => {
        const data = await request.formData();
        const checkIn = data.get('check_in')?.toString();
        const checkOut = data.get('check_out')?.toString();
        
        if (!checkIn || !checkOut) {
            throw error(400, 'Missing required fields');
        }
        
        try {
            console.log('Adding exercise:', { checkIn, checkOut });
            
            await tursoClient.execute({
                sql: 'INSERT INTO exercises (check_in, check_out) VALUES (?, ?)',
                args: [checkIn, checkOut]
            });
            
            return {
                success: true
            };
        } catch (err: any) {
            console.error('Error adding exercise:', err instanceof Error ? err.message : String(err));
            throw error(500, 'Failed to add exercise: ' + (err instanceof Error ? err.message : String(err)));
        }
    }
}; 