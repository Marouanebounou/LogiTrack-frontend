import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import api from "../../api/axiosInstance"
import { Box, Typography, Button, Paper, TextField, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton, TablePagination } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"


export const ClientList = () => {
    const navigate = useNavigate()
    const {user} = useAuth()
    const [clients , setClients] = useState([])
    const [page , setPage] = useState(0)
    const [rowPerPage , setRowPerPage] = useState(10)
    const [totalElements, setTotalElements] = useState(0)
    const [searchTerm , setSearchTerm] = useState('')

    const fetchClients = async () => {
        try {
            const response = await api.get('/users/role/CLIENT' , {
                params: {
                    page: page,
                    size: rowPerPage,
                    nom: searchTerm.trim() || undefined,
                    sort: 'nom',
                    order: 'asc'
                }
            })
            setClients(response.data.content || response.data)
            setTotalElements(response.data.totalElements || response.data.length)
            
        } catch (error) {
            console.error('Erreur lors du chargement des clients:', error)    
        }
    }

    useEffect(() => {
        fetchClients()
    }, [page, rowPerPage , searchTerm])
    
    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce client ?")) {
            try{
                await api.delete(`/users/${id}`)
                fetchClients()
            }catch(error){
                console.error('Erreur lors de la suppression:', error)
            }
        }
    }

    return (
    <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" fontWeight="bold">Gestion des Clients</Typography>
            {['ADMIN', 'MANAGER'].includes(user?.role) && (
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/clients/new')}
            >
                Nouveau Client
            </Button>
            )}
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
            fullWidth
            label="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
            }}
            />
        </Paper>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell align="center">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {clients.map((client, index) => (
                <TableRow key={client?.id || `client-${index}`}>
                    <TableCell>#{client?.id}</TableCell>
                    <TableCell>{client?.nom}</TableCell>
                    <TableCell>{client?.prenom}</TableCell>
                    <TableCell>{client?.email}</TableCell>
                    <TableCell>{client?.number}</TableCell>
                    <TableCell align="center">
                    {['ADMIN', 'MANAGER'].includes(user?.role) && (
                        <Tooltip title="Modifier">
                        <IconButton onClick={() => navigate(`/clients/edit/${client.id}`)}>
                            <EditIcon color="primary" />
                        </IconButton>
                        </Tooltip>
                    )}
                    {user?.role === 'ADMIN' && (
                        <Tooltip title="Supprimer">
                        <IconButton onClick={() => handleDelete(client.id)}>
                            <DeleteIcon color="error" />
                        </IconButton>
                        </Tooltip>
                    )}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
            <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowPerPage}
            onRowsPerPageChange={(e) => {
                setRowPerPage(parseInt(e.target.value, 10));
                setPage(0);
            }}
            />
        </Paper>
    </Box>
    );

}