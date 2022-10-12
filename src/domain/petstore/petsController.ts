import { Request, Response } from 'express';

class Pets {
	public static index (req: Request, res: Response): void {
		return res.render('pets/index', {
			title: 'Home'
		});
	}

    public static create(req: Request, res: Response): void {
        // not implemented
        res.sendStatus(403);
	}
}

export default Pets;
