

export type WinstonLoggerOptions = {
    label: string;

    log_insts: {
        console: {
            level: string;
        } | null;

        db: {
            level: string;
            db_inst: string;
            connstring: string | null;
        } | null;

        file: {
            level: string;
            file_path: string;
        } | null;
    };
};
