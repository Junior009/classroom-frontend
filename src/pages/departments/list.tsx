import React from 'react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { useTable } from '@refinedev/react-table'
import { Department } from '@/types'
import { Badge } from '@/components/ui/badge.tsx'
import { ColumnDef } from '@tanstack/react-table'

import { useMemo} from 'react'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'

const DepartmentsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchFilters = searchQuery ? [
        {field: 'name', operator: 'contains' as const, value: searchQuery }
    ]: [];

    const departmentTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(() =>[
            {
                id: 'code',
                accessorKey: 'code',
                size: 100,
                header: () => <p className='column-title ml -2 '>Code</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
            },
            {
                 id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue}) => <span className='text-foreground'>{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: () => <p className='column-title ml -2 '>Description</p>,
                cell: ({ getValue}) => <span className='text-truncate'>{getValue<string>()}</span>
            },
            {
                id: 'actions',
                size: 180,
                header: () => <p className='column-title'>Actions</p>,
                cell: ({ row }) => (
                    <div className='flex items-center gap-2'>
                        <EditButton resource='departments' recordItemId={row.original.id} variant='outline' size='sm'>Editar</EditButton>
                        <DeleteButton resource='departments' recordItemId={row.original.id} size='sm'>Eliminar</DeleteButton>
                    </div>
                )
            }
        ], []),
        refineCoreProps: {
            resource: 'departments',
            pagination: {pageSize: 10, mode: 'server'},
            filters: {
                permanent: searchFilters
            },
            sorters:{
                initial: [
                    {field: 'id', order: 'desc'},
                ]
            },
        }
    });

  return (
   <ListView>
        <Breadcrumb />
        <h1 className="page-title">Departments</h1>

        <div className='intro-row'>
            <p>Quick access to essential metrics and management tools.</p>

            <div className='actions-row'>
                <div className='search-field'>
                    <search className='search-icon' />

                    <Input 
                        type="text"
                        placeholder = "Serch by name..."
                        className="pl-10 w-full" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        
                    />
                </div>


                    <CreateButton />

            </div>

        </div>

        <DataTable table={departmentTable}/>

    </ListView>
  )
}

export default DepartmentsList