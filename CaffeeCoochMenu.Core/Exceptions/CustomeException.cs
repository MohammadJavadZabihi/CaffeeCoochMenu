namespace CaffeeCoochMenu.Core.Exceptions
{
    public class CustomeException : Exception
    {
        public CustomeException() { }
        public CustomeException(string message) : base(message) { }
        public CustomeException(string message, 
            Exception innerrException) : base(message, innerrException) { }
    }
}
