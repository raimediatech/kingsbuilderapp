/**
 * KingsBuilder History Manager
 * =====================================================
 * Manages undo/redo functionality and state history
 */

class HistoryManager {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
        this.maxStates = 50;
        this.initialized = false;
        
        console.log('📚 History Manager initialized');
    }

    async init() {
        if (this.initialized) return;
        
        // Save initial state
        this.saveInitialState();
        
        this.initialized = true;
        console.log('✅ History Manager ready');
    }

    /**
     * Save initial state
     */
    saveInitialState() {
        if (window.kingsBuilder?.canvasManager) {
            const initialState = window.kingsBuilder.canvasManager.getState();
            this.saveState(initialState);
        }
    }

    /**
     * Save current state
     */
    saveState(state) {
        if (!state) {
            if (window.kingsBuilder?.canvasManager) {
                state = window.kingsBuilder.canvasManager.getState();
            } else {
                return;
            }
        }

        // Remove any states after current index (when user made changes after undo)
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Add new state
        this.history.push({
            ...state,
            timestamp: Date.now(),
            id: this.generateStateId()
        });

        // Limit history size
        if (this.history.length > this.maxStates) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }

        // Update UI buttons
        this.updateUndoRedoButtons();
        
        console.log(`📚 State saved (${this.history.length} states, index: ${this.currentIndex})`);
    }

    /**
     * Undo last action
     */
    undo() {
        if (!this.canUndo()) {
            console.log('📚 Cannot undo - no previous states');
            return null;
        }

        this.currentIndex--;
        const state = this.history[this.currentIndex];
        
        this.updateUndoRedoButtons();
        
        console.log(`📚 Undo to state ${this.currentIndex}`);
        return state;
    }

    /**
     * Redo last undone action
     */
    redo() {
        if (!this.canRedo()) {
            console.log('📚 Cannot redo - no next states');
            return null;
        }

        this.currentIndex++;
        const state = this.history[this.currentIndex];
        
        this.updateUndoRedoButtons();
        
        console.log(`📚 Redo to state ${this.currentIndex}`);
        return state;
    }

    /**
     * Check if undo is possible
     */
    canUndo() {
        return this.currentIndex > 0;
    }

    /**
     * Check if redo is possible
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    /**
     * Update undo/redo button states
     */
    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('kb-undo');
        const redoBtn = document.getElementById('kb-redo');

        if (undoBtn) {
            undoBtn.disabled = !this.canUndo();
            undoBtn.classList.toggle('disabled', !this.canUndo());
        }

        if (redoBtn) {
            redoBtn.disabled = !this.canRedo();
            redoBtn.classList.toggle('disabled', !this.canRedo());
        }
    }

    /**
     * Get current state
     */
    getCurrentState() {
        if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
            return this.history[this.currentIndex];
        }
        return null;
    }

    /**
     * Get state by index
     */
    getState(index) {
        if (index >= 0 && index < this.history.length) {
            return this.history[index];
        }
        return null;
    }

    /**
     * Get all states
     */
    getAllStates() {
        return [...this.history];
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        this.currentIndex = -1;
        this.updateUndoRedoButtons();
        
        console.log('📚 History cleared');
    }

    /**
     * Go to specific state
     */
    goToState(index) {
        if (index < 0 || index >= this.history.length) {
            console.warn('📚 Invalid state index:', index);
            return null;
        }

        this.currentIndex = index;
        const state = this.history[index];
        
        this.updateUndoRedoButtons();
        
        console.log(`📚 Jumped to state ${index}`);
        return state;
    }

    /**
     * Get history summary
     */
    getHistorySummary() {
        return {
            totalStates: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
            maxStates: this.maxStates
        };
    }

    /**
     * Generate unique state ID
     */
    generateStateId() {
        return 'state_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Set maximum number of states
     */
    setMaxStates(max) {
        this.maxStates = Math.max(1, max);
        
        // Trim history if needed
        if (this.history.length > this.maxStates) {
            const removeCount = this.history.length - this.maxStates;
            this.history.splice(0, removeCount);
            this.currentIndex = Math.max(0, this.currentIndex - removeCount);
        }
        
        console.log(`📚 Max states set to ${this.maxStates}`);
    }

    /**
     * Export history
     */
    exportHistory() {
        return {
            history: this.history,
            currentIndex: this.currentIndex,
            maxStates: this.maxStates,
            exportedAt: Date.now()
        };
    }

    /**
     * Import history
     */
    importHistory(data) {
        if (!data || !Array.isArray(data.history)) {
            console.error('📚 Invalid history data');
            return false;
        }

        this.history = data.history;
        this.currentIndex = Math.min(data.currentIndex || 0, this.history.length - 1);
        this.maxStates = data.maxStates || 50;
        
        this.updateUndoRedoButtons();
        
        console.log(`📚 History imported (${this.history.length} states)`);
        return true;
    }

    /**
     * Get state differences (for debugging)
     */
    getStateDiff(fromIndex, toIndex) {
        const fromState = this.getState(fromIndex);
        const toState = this.getState(toIndex);
        
        if (!fromState || !toState) {
            return null;
        }

        // Simple diff - in production, use a proper diff library
        return {
            from: fromIndex,
            to: toIndex,
            fromTimestamp: fromState.timestamp,
            toTimestamp: toState.timestamp,
            elementsChanged: fromState.elements?.length !== toState.elements?.length
        };
    }

    /**
     * Create history checkpoint
     */
    createCheckpoint(label = '') {
        const state = window.kingsBuilder?.canvasManager?.getState();
        if (state) {
            state.checkpoint = true;
            state.label = label;
            this.saveState(state);
            
            console.log(`📚 Checkpoint created: ${label}`);
        }
    }

    /**
     * Get checkpoints
     */
    getCheckpoints() {
        return this.history
            .map((state, index) => ({ state, index }))
            .filter(({ state }) => state.checkpoint)
            .map(({ state, index }) => ({
                index,
                label: state.label || `Checkpoint ${index}`,
                timestamp: state.timestamp
            }));
    }

    /**
     * Go to checkpoint
     */
    goToCheckpoint(checkpointIndex) {
        const checkpoint = this.history.find((state, index) => 
            state.checkpoint && index === checkpointIndex
        );
        
        if (checkpoint) {
            return this.goToState(checkpointIndex);
        }
        
        console.warn('📚 Checkpoint not found:', checkpointIndex);
        return null;
    }

    /**
     * Auto-save functionality
     */
    enableAutoSave(interval = 30000) { // 30 seconds
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            if (window.kingsBuilder?.canvasManager) {
                const currentState = window.kingsBuilder.canvasManager.getState();
                const lastState = this.getCurrentState();
                
                // Only save if state has changed
                if (!lastState || JSON.stringify(currentState) !== JSON.stringify(lastState)) {
                    this.createCheckpoint('Auto-save');
                }
            }
        }, interval);

        console.log(`📚 Auto-save enabled (${interval}ms interval)`);
    }

    /**
     * Disable auto-save
     */
    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
            console.log('📚 Auto-save disabled');
        }
    }

    /**
     * Get memory usage (approximate)
     */
    getMemoryUsage() {
        const historySize = JSON.stringify(this.history).length;
        return {
            states: this.history.length,
            approximateSize: `${Math.round(historySize / 1024)}KB`,
            averageStateSize: `${Math.round(historySize / this.history.length / 1024)}KB`
        };
    }

    /**
     * Optimize history (remove redundant states)
     */
    optimizeHistory() {
        if (this.history.length < 2) return;

        const optimized = [this.history[0]]; // Keep first state
        
        for (let i = 1; i < this.history.length; i++) {
            const current = this.history[i];
            const previous = optimized[optimized.length - 1];
            
            // Keep state if it's significantly different or is a checkpoint
            if (current.checkpoint || this.isSignificantChange(previous, current)) {
                optimized.push(current);
            }
        }

        const removedCount = this.history.length - optimized.length;
        this.history = optimized;
        this.currentIndex = Math.min(this.currentIndex, this.history.length - 1);
        
        this.updateUndoRedoButtons();
        
        console.log(`📚 History optimized: removed ${removedCount} redundant states`);
        return removedCount;
    }

    /**
     * Check if state change is significant
     */
    isSignificantChange(state1, state2) {
        if (!state1 || !state2) return true;
        
        // Simple comparison - in production, use more sophisticated logic
        return (
            state1.elements?.length !== state2.elements?.length ||
            JSON.stringify(state1.elements) !== JSON.stringify(state2.elements)
        );
    }
}

// Export for global use
window.HistoryManager = HistoryManager;