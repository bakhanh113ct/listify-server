import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { IPayload } from '../utils/jwt_service';
import { ResJSON } from '../utils/interface';
import { GroupTask, SubTask, Task, Voice } from '../models';

export const getAllTaskBelongToGTaskController = async (
  req: Request<{ gtaskId: string }>,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { gtaskId: unconvertGtaskId } = req.params;
    const gtaskId: number = +unconvertGtaskId;

    if (!gtaskId) {
      throw createError.BadRequest('Missing params');
    }

    const gtask = await GroupTask.findOne({
      where: {
        id: gtaskId,
        userMail,
      },
      attributes: {
        exclude: ['userMail', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Task,
          through: {
            attributes: [],
          },
          include: [
            {
              model: SubTask,
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: Voice,
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
          attributes: {
            exclude: ['userMail', 'createdAt', 'updatedAt'],
          },
        },
      ],
      nest: true,
    });

    if (!gtask) {
      throw createError.BadRequest('gtaskId does not exist');
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: gtask,
    });
  } catch (err) {
    next(err);
  }
};
