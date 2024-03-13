import { Category, Channel, Member, Message, Server, User } from "@prisma/client";
import { NextApiResponse } from "next";
import {Server as NetServer, Socket} from 'net'
import {Server as SocketIOServer} from 'socket.io'

export type baseUserType = {
    id: string;
    name: string;
    image: string | null;
    email: string;
    username: string;
    bio: string | null;
    provider: string | null;
    isEmailVerified: boolean;
}

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { user: baseUserType })[];
    Category: (Category & {channels: Channel[], _count: {channels: number}})[];
    _count: {
        Category: number,
        members: number
    }
};

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}

export type MessageWithMemberWithProfile = Message & {
    member: Member & {
      user:{
        id: string,
        image: null | string,
        name: string,
        username: string
      }
    }
}