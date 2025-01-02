import { Request, Response } from 'express';
import CommentService from '../../application/services/comment.service';
import { IComment } from '../../domain/entities/comment.entity';

class CommentController {
    private commentService = CommentService;

    // public async createComment(req: Request, res: Response): Promise<void> {
    //     try {
    //         const commentData: IComment = req.body;
    //         const comment = await this.commentService.createComment(commentData);
    //         res.status(201).json(comment);
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             res.status(500).json(`Error: ${error.message}`);
    //         } else {
    //             res.status(500).json('Unknown error');
    //         }
    //     }
    // }

    // public async getCommentById(req: Request, res: Response): Promise<void> {
    //     try {
    //         const commentId = req.params.id;
    //         const comment = await this.commentService.getCommentById(commentId);
    //         if (!comment) {
    //             res.status(404).json({ message: 'Comment not found' });
    //         }
    //         res.status(200).json(comment);
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             res.status(500).json(`Error: ${error.message}`);
    //         } else {
    //             res.status(500).json('Unknown error');
    //         }
    //     }
    // }

    public async updateComment(req: Request, res: Response): Promise<void> {
        try {
            const commentId = req.params.id;
            const updateData = req.body;
            const updatedComment = await this.commentService.updateComment(commentId, updateData);
            if (!updatedComment) {
                res.status(404).json({ message: 'Comment not found' });
            }
            res.status(200).json(updatedComment);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const commentId = req.params.id;
            const deletedComment = await this.commentService.deleteComment(commentId);
            if (!deletedComment) {
                res.status(404).json({ message: 'Comment not found' });
            }
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }
}

export default new CommentController(); 