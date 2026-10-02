import React from 'react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { SelectTrigger } from '@/components/ui/select'
import { SelectContent, SelectValue } from '@radix-ui/react-select'
import { Select } from '@radix-ui/react-select'
import { SelectItem } from '@/components/ui/select' 
import { DEPARTMENT_OPTIONS } from '@/components/constants/index'
import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { useTable } from '@refinedev/react-table'
import { Subject } from '@/types'
import { Badge } from '@/components/ui/badge.tsx'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo} from 'react'

const SubjectsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all')

    const departmentFilters = selectedDepartment === 'all' ? [] : [
        {
            field: 'department', operator: 'eq' as const, value: selectedDepartment
        }
    ]
    const searchFilters = searchQuery ? [
        {field: 'name', operator: 'contains' as const, value: searchQuery }
    ]: [];

    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(() =>[
            {
                id: 'code',
                accessorkey: 'code',
                size: 100,
                header: () => <p className='column-title ml -2 '>Code</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
            },
            {
                 id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Name</p>,
                Cell: ({ getValue}) => <span className='text-foreground'>{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'department',
                accessorKey: 'department.name',
                size: 150,
                header: () => <p className='column-title ml -2 '>Department</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: () => <p className='column-title ml -2 '>Description</p>,
                Cell: ({ getValue}) => <span className='text-truncate'>{getValue<string>()}</span>
            }
        ], []),
        refineCoreProps: {
            resource: 'subjects',
            pagination: {pageSize: 10, mode: 'server'},
            filters: {
                permanent: [...departmentFilters, ...searchFilters]
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
        <h1 className="page-title">Subjects</h1>

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

                <div className='flex gap-2 w-full sm:w-auto'>
                    <Select 
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                    >
                        
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Departments
                            </SelectItem>
                            {DEPARTMENT_OPTIONS.map(department => (
                                <SelectItem key={department.value}
                                value={department.value}>
                                    {department.label}
                                </SelectItem>
                            )) }
                        </SelectContent>
                    </Select>

                    <CreateButton />
                </div>
            </div>

        </div>

        <DataTable table={subjectTable}/>

    </ListView>
  )
}

export default SubjectsList