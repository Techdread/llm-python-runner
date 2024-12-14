import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'prompt-history';

// Initialize storage if empty
if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

export function savePrompt(promptData) {
    const history = readHistory();
    const newEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...promptData
    };
    history.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return newEntry;
}

export function readHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return JSON.parse(data) || [];
    } catch (error) {
        console.error('Error reading history:', error);
        return [];
    }
}

export function exportHistory() {
    return readHistory();
}

export function importHistory(data) {
    try {
        // Validate data structure
        if (!Array.isArray(data)) {
            throw new Error('Invalid history data format');
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error importing history:', error);
        return false;
    }
}

export function deletePrompt(id) {
    const history = readHistory();
    const newHistory = history.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export function searchHistory(query) {
    const history = readHistory();
    return history.filter(entry => 
        entry.prompt.userPrompt.toLowerCase().includes(query.toLowerCase()) ||
        entry.response.formattedCode.toLowerCase().includes(query.toLowerCase())
    );
}
