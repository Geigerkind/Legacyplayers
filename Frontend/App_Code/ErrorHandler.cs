using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RPLL
{
    public static class ErrorHandler
    {
        public static Exception MError = new Exception("NONE");
        public static string MThrowingPage = "";

        public static void Execute()
        {
            App.GetDB().Query("INSERT INTO gn_error (type, text, page) VALUES (\""+MError.Message+"\", \""+MError.StackTrace+"\", \""+MThrowingPage+"\")").ExecuteNonQuery();
        }
    }
}