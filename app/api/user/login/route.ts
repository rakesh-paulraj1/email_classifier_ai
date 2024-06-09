"use server";

import client from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const reqbody = await req.json();
    const { username, useremail } = reqbody;

    try {
        const availableuser = await client.user.findUnique({
            where: {
              email: useremail
            }
          });
          if (availableuser) {
            return NextResponse.json({ previous_mails: availableuser.previous_mails });
          }
        const newUser = await client.user.create({
            data: {
                email: useremail,
                name: username,
                previous_mails: 0,
            },
        });

        return NextResponse.json({ previousmails: newUser.previous_mails });
    } catch (error) {
        return NextResponse.json({ error: "Error while signing up" });
    }
}
