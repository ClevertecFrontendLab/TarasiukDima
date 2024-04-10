import {
    FC,
    Fragment,
    MutableRefObject,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { EditFilled, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { TTrainingVariants } from '@app-types/catalogs';
import { TTrainingNameChosenIVariant } from '@app-types/index';
import { COUNT_TRAINING_ITEMS_PER_PAGE, MY_TRAININGS_IDS } from '@constants/index';
import { useAppSelector, useDayInfo } from '@hooks/index';
import { getTrainingPeriodText } from '@utils/index';
import { Button, Table } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import { ColumnsType, FilterValue, SorterResult } from 'antd/lib/table/interface';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';

import { TrainingsContext } from '../trainings-context';
import { TTrainingsContent } from '../types';

import { TrainingDayModal } from './my-trainings-day-modal';
import { MyTrainingsExercisesModal } from './my-trainings-exercises-modal';
import { MyTrainingsTableRowName } from './my-trainings-table-name';

type TableDataType = {
    id: string;
    type: ReactNode;
    frequency: ReactNode;
    frequencyNumber: number;
    edit: ReactNode;
};

type TableParams = {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: SorterResult<TableDataType>;
    filters?: Record<string, FilterValue | null>;
};

export const MyTrainings: FC<{
    trainingVariants: TTrainingVariants;
    showErrorTrainingsNamesModalCb: () => void;
}> = ({ trainingVariants, showErrorTrainingsNamesModalCb }) => {
    const { personalTraining } = useAppSelector((state) => state.app);
    const [tableRowRefs, setTableRowRefs] = useState<{
        [key: string]: React.MutableRefObject<HTMLDivElement | null>;
    }>({});
    const { getDayJsItem, getDateNeededFormat } = useDayInfo();

    const {
        editTrainingButtonCB,
        changeSelectCurrentDay,
        changeChosenNameTrainingCb,
        trainingsDataForShow,
        changeIsEditTraining,
        isUpdateTrainingError,
        isAddTrainingError,
        selectedDay,
        saveChangedTrainingLastState,
    } = useContext(TrainingsContext) as TTrainingsContent;

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: COUNT_TRAINING_ITEMS_PER_PAGE,
            hideOnSinglePage: true,
            position: ['bottomLeft'],
        },
    });
    const [showExercisesModal, setShowExercisesModal] = useState<boolean>(false);
    const [showDayModal, setShowDayModal] = useState<boolean>(false);

    useEffect(() => {
        if (isAddTrainingError) {
            showErrorTrainingsNamesModalCb();
            setShowDayModal(false);
            setShowExercisesModal(false);
        }
    }, [isAddTrainingError, showErrorTrainingsNamesModalCb]);

    useEffect(() => {
        if (isUpdateTrainingError) {
            showErrorTrainingsNamesModalCb();
            setShowDayModal(false);
            setShowExercisesModal(false);
        }
    }, [isUpdateTrainingError, showErrorTrainingsNamesModalCb]);


    const handleTableChange = (
        pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        sorter: SorterResult<TableDataType> | Array<SorterResult<TableDataType>>,
    ) => {
        setTableParams({
            pagination,
            ...sorter,
        });
    };

    const createTrainingCb = useCallback(() => {
        changeSelectCurrentDay(null);
        changeIsEditTraining(false);
        setShowExercisesModal(true);
    }, [changeIsEditTraining, changeSelectCurrentDay]);

    const isEmptyListVariants = !trainingVariants.length;
    const isEmptyTab = !Object.keys(trainingsDataForShow).length;

    const editButtonCb = useCallback(
        (name: string, date: string) => {
            changeSelectCurrentDay(getDayJsItem(date));
            editTrainingButtonCB(name as TTrainingNameChosenIVariant);
            setShowExercisesModal(true);
            saveChangedTrainingLastState();
        },
        [editTrainingButtonCB, changeSelectCurrentDay, saveChangedTrainingLastState, getDayJsItem],
    );

    const showDayModalCb = useCallback(
        (name: string, date: string) => {
            changeSelectCurrentDay(getDayJsItem(date));
            changeChosenNameTrainingCb(name as TTrainingNameChosenIVariant);
            setShowDayModal(true);
        },
        [changeSelectCurrentDay, getDayJsItem, changeChosenNameTrainingCb],
    );

    const closeDayModalCb = useCallback(() => {
        changeSelectCurrentDay(null);
        changeChosenNameTrainingCb(null);
        setShowDayModal(false);
    }, [changeSelectCurrentDay, changeChosenNameTrainingCb]);

    const addExercisesCb = useCallback(() => {
        setShowDayModal(false);
        setShowExercisesModal(true);
        saveChangedTrainingLastState();
    }, [saveChangedTrainingLastState]);

    const closeExercisesModalCb = useCallback(() => {
        changeChosenNameTrainingCb(null);
        changeSelectCurrentDay(null);
        changeIsEditTraining(false);
        setShowExercisesModal(false);
    }, [changeIsEditTraining, changeSelectCurrentDay, changeChosenNameTrainingCb]);

    const changeTableRowRefItems = useCallback(
        (rowRef: MutableRefObject<HTMLDivElement | null>, date: string) => {
            setTableRowRefs((prev) => ({
                ...prev,
                [getDateNeededFormat(date)]: rowRef,
            }));
        },
        [getDateNeededFormat],
    );

    const columns: ColumnsType<TableDataType> = [
        {
            title: 'Тип тренировки',
            dataIndex: 'type',
        },
        {
            title: 'Периодичность',
            dataIndex: 'frequency',
            sorter: (a, b) => a.frequencyNumber - b.frequencyNumber,
        },
        {
            title: '',
            dataIndex: 'edit',
            width: 25,
        },
    ];

    const tableDataSource = useMemo(() => {
        const items: TableDataType[] = [];

        personalTraining.forEach(({ date, name, parameters, isImplementation }, index) => {
            const frequency = parameters?.period;

            items.push({
                id: date + name,
                type: (
                    <MyTrainingsTableRowName
                        name={name}
                        date={date}
                        changeTableRowRefItems={changeTableRowRefItems}
                        showDayModalCb={showDayModalCb}
                    />
                ),
                frequency: getTrainingPeriodText(frequency),
                frequencyNumber: frequency ?? -1,
                edit: (
                    <Button
                        className='edit-training'
                        data-test-id={`${MY_TRAININGS_IDS.editTableItemBtn}${index}`}
                        onClick={() => {
                            editButtonCb(name, date);
                        }}
                        aria-label={`Редактировать тренировку - '${name}'`}
                        disabled={isImplementation}
                    >
                        {isImplementation ? <EditFilled /> : <EditOutlined />}
                    </Button>
                ),
            });
        });

        return items;
    }, [personalTraining, changeTableRowRefItems, editButtonCb, showDayModalCb]);

    return (
        <div className='my-trainings'>
            {isEmptyTab ? (
                <Paragraph className='my-trainings__empty'>
                    У вас ещё нет созданных тренировок
                </Paragraph>
            ) : (
                <Table
                    data-test-id={MY_TRAININGS_IDS.table}
                    className='my-trainings__table'
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={tableDataSource}
                    pagination={tableParams.pagination}
                    loading={false}
                    onChange={handleTableChange}
                />
            )}

            {!isEmptyListVariants && (
                <Button
                    type='primary'
                    className={classNames('button-page', {
                        'middle-btn': isEmptyTab,
                    })}
                    onClick={createTrainingCb}
                    data-test-id={MY_TRAININGS_IDS.addTrainingBtn}
                >
                    {isEmptyTab ? (
                        'Создать тренировку'
                    ) : (
                        <Fragment>
                            <PlusOutlined /> Новая тренировка
                        </Fragment>
                    )}
                </Button>
            )}

            {showExercisesModal && (
                <MyTrainingsExercisesModal
                    trainingVariants={trainingVariants}
                    isShow={showExercisesModal}
                    closeAddExercises={closeExercisesModalCb}
                />
            )}

            {showDayModal && (
                <TrainingDayModal
                    refEl={tableRowRefs[selectedDay].current as HTMLElement}
                    isShow={showDayModal}
                    trainingVariants={trainingVariants}
                    closeCb={closeDayModalCb}
                    showAddExercisesCb={addExercisesCb}
                />
            )}
        </div>
    );
};
