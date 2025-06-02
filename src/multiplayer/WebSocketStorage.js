// Socket.io client is included via socket.io.min.js in the HTML

export class WebSocketStorage {
    constructor(serverUrl = 'http://localhost:3000') {
        this.socket = io(serverUrl);
        this.collections = new Map();
        
        // Setup socket event listeners
        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
        
        // Listen for collection updates from the server
        this.socket.on('collection_update', (data) => {
            const { key, value } = data;
            this.collections.set(key, value);
        });
    }

    /**
     * Get a collection from the local cache (puffer)
     * @param {string} key - The collection key
     * @returns {any} The collection data or null if not found
     */
    getCollection(key) {
        // Only serve data from the local cache (puffer)
        return this.collections.get(key) || null;
    }

    /**
     * Update a collection on the server
     * @param {string} key - The collection key
     * @param {any} value - The collection value
     */
    updateCollection(key, value) {
        // Update local cache
        this.collections.set(key, value);
        
        // Send update to server
        this.socket.emit('update_collection', {
            key,
            value
        });
    }

    /**
     * Add an item to a collection
     * @param {string} key - The collection key
     * @param {any} value - The item to add
     */
    addToCollection(key, value) {
        // Send add operation directly to server
        this.socket.emit('add_to_collection', {
            key,
            value
        });
        
        // Update local cache if available
        if (this.collections.has(key)) {
            const collection = this.collections.get(key) || [];
            collection.push(value);
            this.collections.set(key, collection);
        }
    }

    /**
     * Disconnect from the WebSocket server
     */
    disconnect() {
        this.socket.disconnect();
    }
}
