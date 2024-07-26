
import More from '~/assets/image/more.png'
import LeftArrow from '~/assets/image/left-arrow.png';
import RightArrow from '~/assets/image/right-arrow.png';

export interface PaginationProps {
    totalData: number;
    current: number;
    limit: number;
    onChangePage: (to: number) => void;
}

const Pagination = (props: PaginationProps) => {
    const { current, limit, onChangePage, totalData } = props;

    const totalPages = Math.ceil(totalData / limit);

    const handlePrevious = () => {
        if (current > 1) {
            onChangePage(current - 1);
        }
    };

    const handleNext = () => {
        if (current < totalPages) {
            onChangePage(current + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onChangePage(page);
    };

    const renderPageNumbers = () => {
        const pages = [];

        if (totalData > 0) {
            const maxPagesToShow = 4;
            const halfWindow = Math.floor(maxPagesToShow / 2);

            let startPage = Math.max(1, current - halfWindow);
            let endPage = Math.min(totalPages, current + halfWindow);

            if (current <= halfWindow) {
                endPage = Math.min(totalPages, maxPagesToShow);
            }

            if (current + halfWindow >= totalPages) {
                startPage = Math.max(1, totalPages - maxPagesToShow + 1);
            }

            if (startPage > 1) {
                pages.push(
                    <button
                        key={1}
                        onClick={() => handlePageClick(1)}
                        className={`flex items-center px-[6px] snm:px-[12px] h-8 snm:h-10   border-solid border-[1px] border-gray-300 rounded-[4px] gap-[4px] ${current === 1 ? "bg-black text-white font-bold" : ""}`}
                    >
                        1
                    </button>
                );
                if (startPage > 2) {
                    pages.push(<div className="flex items-center px-[6px] snm:px-[10px] py-[4px] h-8 snm:h-10    border-solid border-[1px] border-gray-300 rounded-[4px] gap-[4px]">
                        <img src={More} className='w-4 h-4'/>
                    </div>);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageClick(i)}
                        className={`flex items-center px-[6px] snm:px-[12px] h-8 snm:h-10   border-solid border-[1px] border-gray-300 rounded-[4px] gap-[4px] ${current === i ? "bg-black text-white font-bold" : ""}`}
                    >
                        {i}
                    </button>
                );
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push(<div className="flex items-center px-[6px] snm:px-[10px] py-[4px] h-8 snm:h-10    border-solid border-[1px] border-gray-300 rounded-[4px] gap-[4px]">
                        <img src={More} className='w-4 h-4'/>
                    </div>);
                }
                pages.push(
                    <button
                        key={totalPages}
                        onClick={() => handlePageClick(totalPages)}
                        className={`flex items-center px-[6px] snm:px-[12px] h-8 snm:h-10   border-solid border-[1px] border-gray-300 rounded-[4px] gap-[4px] ${current === totalPages ? "bg-black text-white font-bold" : ""}`}
                    >
                        {totalPages}
                    </button>
                );
            }
        } else {
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageClick(1)}
                    className={`flex items-center px-[6px] snm:px-[12px] h-8 snm:h-10   border-solid border-[1px] border-gray-300 rounded-[4px] gap-[4px] bg-black text-white font-bold"`}
                >
                    {1}
                </button>
            )
        }

        return pages;
    };

    return (
        <div className={`flex items-center gap-[6px]`}>
            <button
                onClick={handlePrevious}
                className='flex items-center px-[6px] snm:px-[12px] py-[4px] h-8 snm:h-10   border-solid border-[1px] border-gray-300 rounded-[4px] gap-[4px]'
                disabled={current === 1}
            >
                <img src={LeftArrow} className='w-4 h-4' /> Back
            </button>
            {renderPageNumbers()}
            <button
                onClick={handleNext}
                className='flex items-center px-[6px] snm:px-[12px] py-[4px] h-8 snm:h-10    border-solid border-[1px] border-gray-300 rounded-[4px] gap-[4px]'
                disabled={current === totalPages}
            >
                Next <img src={RightArrow} className='w-4 h-4' />
            </button>
        </div>
    )
}

export default Pagination