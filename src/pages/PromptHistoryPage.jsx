import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ContentCopy as CopyIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
} from '@mui/icons-material';
import { readHistory, deletePrompt, exportHistory, importHistory } from '../utils/promptHistoryStorage';

export default function PromptHistoryPage() {
    const [history, setHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const data = readHistory();
        setHistory(data);
    };

    const handleDelete = (id) => {
        deletePrompt(id);
        loadHistory();
    };

    const handleCopy = (prompt) => {
        navigator.clipboard.writeText(prompt.prompt.userPrompt);
    };

    const handleExport = () => {
        const data = exportHistory();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt-history.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (importHistory(data)) {
                        loadHistory();
                    }
                } catch (error) {
                    console.error('Error importing file:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    const filteredHistory = history.filter(entry =>
        entry.prompt.userPrompt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Prompt History
            </Typography>

            <Paper sx={{ mb: 2, p: 2, display: 'flex', gap: 2 }}>
                <TextField
                    label="Search Prompts"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExport}
                >
                    Export
                </Button>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                >
                    Import
                    <input
                        type="file"
                        hidden
                        accept=".json"
                        onChange={handleImport}
                    />
                </Button>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Provider</TableCell>
                            <TableCell>Prompt</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredHistory.map((entry) => (
                            <TableRow
                                key={entry.id}
                                hover
                                onClick={() => {
                                    setSelectedPrompt(entry);
                                    setDetailDialogOpen(true);
                                }}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>
                                    {new Date(entry.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell>{entry.provider}</TableCell>
                                <TableCell>{entry.prompt.userPrompt.substring(0, 50)}...</TableCell>
                                <TableCell>{entry.metadata.status}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopy(entry);
                                        }}
                                    >
                                        <CopyIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(entry.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedPrompt && (
                    <>
                        <DialogTitle>Prompt Details</DialogTitle>
                        <DialogContent>
                            <Typography variant="h6" gutterBottom>
                                Prompt
                            </Typography>
                            <Paper sx={{ p: 2, mb: 2 }}>
                                <pre>{selectedPrompt.prompt.userPrompt}</pre>
                            </Paper>

                            <Typography variant="h6" gutterBottom>
                                Generated Code
                            </Typography>
                            <Paper sx={{ p: 2, mb: 2 }}>
                                <pre>{selectedPrompt.response.formattedCode}</pre>
                            </Paper>

                            <Typography variant="body2" color="textSecondary">
                                Provider: {selectedPrompt.provider}
                                <br />
                                Model: {selectedPrompt.metadata.modelName}
                                <br />
                                Time: {new Date(selectedPrompt.timestamp).toLocaleString()}
                                <br />
                                Execution Time: {selectedPrompt.metadata.executionTime}ms
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDetailDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
}
