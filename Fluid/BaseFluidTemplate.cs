﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Fluid.Ast;

namespace Fluid
{
    public class BaseFluidTemplate<T> : IFluidTemplate where T : IFluidTemplate, new()
    {
        static BaseFluidTemplate()
        {
            // Necessary to force the custom template class static constructor
            // as the only member accessed is defined on this class
            RuntimeHelpers.RunClassConstructor(typeof(T).TypeHandle);
        }

        public static FluidParserFactory Factory { get; } = new FluidParserFactory();
        private static Func<IFluidTemplate> TemplateFactory { get; } = () => new T();

        public List<Statement> Statements { get; set; } = new List<Statement>();

        public static T Parse(string template)
        {
            if (!TryParse(template, out var result, out var errors))
            {
                throw new ParseException(errors.FirstOrDefault() ?? "");
            }
            else
            {
                return result;
            }
        }

        public static bool TryParse(string template, out T result, out IEnumerable<string> errors)
        {
            return TryParse(template, true, out result, out errors);
        }

        public static bool TryParse(string template, out T result)
        {
            return TryParse(template, out result, out var errors);
        }

        public static bool TryParse(string template, bool stripEmptyLines, out T result, out IEnumerable<string> errors)
        {
            if (Factory.CreateParser().TryParse(template, stripEmptyLines, out var statements, out errors))
            {
                result = new T
                {
                    Statements = statements
                };
                return true;
            }
            else
            {
                result = default(T);
                return false;
            }
        }

        public async Task RenderAsync(TextWriter writer, TextEncoder encoder, TemplateContext context)
        {
            if (writer == null)
            {
                throw new ArgumentNullException(nameof(writer));
            }

            if (encoder == null)
            {
                throw new ArgumentNullException(nameof(encoder));
            }

            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            context.ParserFactory = Factory;
            context.TemplateFactory = TemplateFactory;

            var count = Statements.Count;
            for (var i = 0; i < count; i++)
            {
                await Statements[i].WriteToAsync(writer, encoder, context);
            }
        }
    }
}
