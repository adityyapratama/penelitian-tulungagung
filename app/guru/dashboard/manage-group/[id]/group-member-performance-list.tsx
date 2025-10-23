"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, CalendarClock } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import type { PerformanceData } from "../lib/data";

dayjs.locale("id");

interface GroupMemberPerformanceListProps {
    performanceData: PerformanceData[];
}

export function GroupMemberPerformanceList({ performanceData }: GroupMemberPerformanceListProps) {
  const sortedData = [...performanceData].sort((a, b) => (b.scores ?? 0) - (a.scores ?? 0));

  return (
    <div className="border rounded-lg overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow className="bg-muted/50">
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Skor Total</TableHead>
                    <TableHead>Login Terakhir</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            Belum ada anggota yang memiliki progres di grup ini.
                        </TableCell>
                    </TableRow>
                ) : (
                    sortedData.map((item, index) => (
                        <TableRow key={item.username} className="hover:bg-muted/20">
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                            <TableCell>
                                <div className="font-medium">{item.username}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="font-semibold">{item.scores ?? 0}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.last_login ? (
                                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                        <CalendarClock className="w-4 h-4" />
                                        {dayjs(item.last_login).format('DD MMM YYYY, HH:mm')}
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground italic">Belum login</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </div>
  );
}