/* eslint-disable @typescript-eslint/no-explicit-any */

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

interface ColumnType {
    field: string;
    header: string;
}



interface TableProps {
    statusTemplate?: (rowData: any) => React.ReactNode;
    actionTemplate?: (rowData: any) => React.ReactNode;
    ratingsTemplate?: (rowData: any) => React.ReactNode;
    columns: ColumnType[];
    data: any;
    addPagination?: boolean;
    searchQuery?: string;
    numberOfrows?: number
}



const Table = ({
    statusTemplate,
    actionTemplate,
    ratingsTemplate,
    columns,
    data,
    addPagination,
    searchQuery,
    numberOfrows
}: TableProps) => {
    const [first, setFirst] = useState(0);
    const rows = numberOfrows || 5;

    const [filteredData, setFilteredData] = useState(data)

    const totalPages = Math.ceil(filteredData.length / rows);
    const currentPage = Math.floor(first / rows) + 1;
    const currentPageData = filteredData.slice(first, first + rows);

    const handleNext = () => {
        if (first + rows < data.length) {
            setFirst(first + rows);
        }
    };

    const handlePrev = () => {
        if (first - rows >= 0) {
            setFirst(first - rows);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formatIndexId = (index: number) => {
        const globalIndex = first + index + 1; 
        return globalIndex.toString().padStart(3, '0'); 
    };

    useEffect(() => {
        if (searchQuery) {
            const filtered = data.filter((item: any) =>
                item.digifranchiseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.status?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    }, [searchQuery, data]);


    return (
        <div>
            <DataTable value={currentPageData} tableStyle={{ minWidth: '20rem' }}>
                {columns.map((col: ColumnType) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        body={
                                col.field === '#'
                                    ? (_, { rowIndex }: any) => formatIndexId(rowIndex)
                                    : col.field === 'status'
                                    ? statusTemplate
                                    : col.field === 'actions'
                                    ? actionTemplate
                                    : col.field === 'ratings'
                                    ? ratingsTemplate
                                    : col.field === 'createdAt'
                                    ? (rowData: any) => formatDate(rowData.createdAt)
                                    : undefined
                        }
                        bodyClassName={`p-4 bg-[#f6dcab] border-b border-b-[#788286] text-[12px] font-[500] leading-[24px]`}
                        headerClassName={`bg-[#e5dac6] text-[15px] border-b-4 border-b-[#788286] p-4 text-[#008080] font-semibold`}
                        style={{ justifyContent: 'center' }}
                    />
                ))}
            </DataTable>
            {addPagination && (<div className="flex justify-between items-center py-4 pl-4 pr-16">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={first === 0}
                        className='p-2 px-3 text-[#344054] font-[600] text-[14px] border-[1.4px] rounded-[12px] border-[#D0D5DD]'
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={first + rows >= data.length}
                        className='p-2 px-3 text-[#344054] font-[600] text-[14px] border-[1.4px] rounded-[12px] border-[#D0D5DD]'
                    >
                        Next
                    </button>
                </div>
            </div>)}
        </div >
    );
};

export default Table;
