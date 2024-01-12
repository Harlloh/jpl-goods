import prisma from "@/libs/prismadb";
import moment from "moment";

export default async function getGraphData() {
  try {
    //get the start and end dates for the data range (7 dats ago to today)
    const startDate = moment().subtract(6, "days").startOf("day");
    const endDate = moment().endOf("day");

    //query the database to get order data grouped by createdDate
    const result = await prisma.order.groupBy({
      by: ["createdDate"],
      where: {
        createdDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status: "complete",
      },
      _sum: {
        amount: true,
      },
    });

    //initialize an object to aggregate the data by day
    const aggregatedData: {
      [day: string]: { day: string; date: string; totalAmount: number };
    } = {};

    //create a cline of the start date to iterate over each day
    const currentDate = startDate.clone();

    //iterate over each day in teh date range
    while (currentDate <= endDate) {
      //format the dat as a strung (e.g... 'Monday)
      const day = currentDate.format("dddd");
      console.log("day", day, currentDate);

      //initializ the aggregated data for the day with the day , date, and totalamount
      aggregatedData[day] = {
        day,
        date: currentDate.format("YYYY-MM-DD"),
        totalAmount: 0,
      };

      //Move to the next datt
      currentDate.add(1, "day");
    }

    //calculate the toatl amount for each day by summing the order amounts
    result.forEach((entry) => {
      const day = moment(entry.createdDate).format("dddd");
      const amount = entry._sum.amount || 0;
      aggregatedData[day].totalAmount += amount;
    });

    //convert the aggregatedData object to an array and sort it by date
    const formattedData = Object.values(aggregatedData).sort((a, b) => {
      return moment(a.date).diff(moment(b.date));
    });

    //return the formatted data
    return formattedData;
  } catch (error: any) {
    throw new Error(error);
  }
}
