﻿using System.IO;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Fluid.Ast
{
    public abstract class Statement
    {
        protected static ValueTask<Completion> Break = new ValueTask<Completion>(Completion.Break);
        protected static ValueTask<Completion> Normal = new ValueTask<Completion>(Completion.Normal);
        protected static ValueTask<Completion> Continue = new ValueTask<Completion>(Completion.Continue);

        public abstract ValueTask<Completion> WriteToAsync(TextWriter writer, TextEncoder encoder, TemplateContext context);
    }
}
